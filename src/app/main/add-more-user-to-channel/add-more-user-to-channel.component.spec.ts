import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreUserToChannelComponent } from './add-more-user-to-channel.component';

describe('AddMoreUserToChannelComponent', () => {
  let component: AddMoreUserToChannelComponent;
  let fixture: ComponentFixture<AddMoreUserToChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMoreUserToChannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMoreUserToChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
